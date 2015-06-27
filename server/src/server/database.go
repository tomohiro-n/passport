package server

import (
	"gopkg.in/mgo.v2"
	"fmt"
)

var DatabaseSession *mgo.Session
var Database *mgo.Database
const QUERIES_COLLECTION string = "queries"

func ConnectDatabase() {
	fmt.Println(ServerConfig.Database)
	url := ServerConfig.Database.User + ":" + ServerConfig.Database.Password + "@" +
		ServerConfig.Database.Host + ":" + ServerConfig.Database.Port + "/" + ServerConfig.Database.DatabaseName
	fmt.Println("connecting to " + url)
	session, err := mgo.Dial(url)
	DatabaseSession = session
	if err != nil {
		panic(err)
	}

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	Database = session.DB(ServerConfig.Database.DatabaseName)
}