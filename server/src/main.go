package main

import (
	"./server"
	"net/http"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"fmt"
	"encoding/json"
)

type QueryRequestStruct struct {
	TwitterId string
	Query string
}

type QueryResponseStruct struct {
	Items []QueryResponseElement `json:"items"`
}

type QueryResponseElement struct {
	TwitterId string `json:"twitterid"`
	Url string `json:"url"`
}

type DestRequestStruct struct {
	TwitterId string
	Query string
	Url string
}

var queries *mgo.Collection

func queryHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var body QueryRequestStruct
	err := decoder.Decode(&body)
	if err != nil {
		panic(err)
	}
	queryString := body.Query
	fmt.Println("query received: " + queryString)
	var founds []QueryResponseElement
	queries.Find(bson.M{"query": body.Query}).All(&founds)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	result := QueryResponseStruct{founds}
	json.NewEncoder(w).Encode(result)

	queries.Insert(body)
}

func destHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var body DestRequestStruct
	err := decoder.Decode(&body)
	if err != nil {
		panic(err)
	}
	fmt.Println(body)
	queries.Update(bson.M{"twitterid": body.TwitterId, "query": body.Query},
		body)
}

func main() {
	server.LoadConfig()
	server.ConnectDatabase()
	queries = server.Database.C(server.QUERIES_COLLECTION)
	http.HandleFunc("/query", queryHandler)
	http.HandleFunc("/dest", destHandler)
	//http.ListenAndServe(":8080", nil)
	err := http.ListenAndServeTLS(":9444", "./public_key", "private_key", nil)
	if err != nil {
		fmt.Println(err)
	}
}
