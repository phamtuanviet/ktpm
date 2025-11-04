import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { ProxyService } from "src/proxy/proxy.service";

@Module({
    controllers: [NewsController],
    providers: [NewsService, ProxyService],
})
export class NewsModule {}