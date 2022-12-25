import { SizeService } from './../service/SizeService';
import { Application } from "express";

export default (app: Application): void => {
    const sizeService = new SizeService();
    
    app.get("/size/all", (req, res) => {

    });
}