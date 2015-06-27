package main

import (
	"./server"
	"net/http"
	"gopkg.in/mgo.v2"
	"fmt"
	"encoding/json"
)

type queryRequestStruct struct {
	TwitterId string
	Query string
}

type queryResponseStruct struct {
	TwitterIds []string `json:"twitterids"`
}

var queries *mgo.Collection

func queryHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var body queryRequestStruct
	err := decoder.Decode(&body)
	if err != nil {
		panic(err)
	}
	fmt.Println(body)
	queryString := body.Query
	fmt.Println("query received: " + queryString)
	queries.Insert(body)

	dummyResponse := queryResponseStruct{[]string{"a", "b", "c", "d"}}
	json.NewEncoder(w).Encode(dummyResponse)
}

func main() {
	server.LoadConfig()
	server.ConnectDatabase()
	queries = server.Database.C(server.QUERIES_COLLECTION)
	http.HandleFunc("/query", queryHandler)
	http.ListenAndServe(":8080", nil)
}