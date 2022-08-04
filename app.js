const express = require("express");
const Container = require("./Container.js");

const app = express();
const container = new Container("./productos.txt");
