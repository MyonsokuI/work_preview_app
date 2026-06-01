package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
/**
* React から呼び出される最小API。
*
* 開発中はReact: http://localhost:5173
* Spring Boot: http://localhost:8080
* のようにポートが分かれるため、CORS 許可を付けています。
*/
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class HelloController {
    @GetMapping("/api/hello")
    public String hello() {
    return "Hello React from Spring Boot";
    }
}
