package com.example.demo.controller;

public class Theme {

    private int pdfId;
    private String name;

    public Theme(int pdfId, String name) {
        this.pdfId = pdfId;
        this.name = name;
    }

    public int getPdfId() {
        return pdfId;
    }

    public void setPdfId(int pdfId) {
        this.pdfId = pdfId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
