package server
import (
	"path/filepath"
	"io/ioutil"
	"encoding/json"
)

type Config struct {
	Database DatabaseConfig `json:"database"`
}

type DatabaseConfig struct {
	Host         string `json:"host"`
	DatabaseName string `json:"databaseName"`
}

var ServerConfig Config

func LoadConfig() {
	absPath, _ := filepath.Abs("src/resources/params.json")
	file, err := ioutil.ReadFile(absPath)
	if err != nil {
		panic(err)
	}
	json.Unmarshal(file, &ServerConfig)
}