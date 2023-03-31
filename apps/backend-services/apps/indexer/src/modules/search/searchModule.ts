import { Module } from '@nestjs/common'
import {
  SearchCompaniesService,
  SearchEventsService,
  SearchFilesService,
  SearchHelperService,
  SearchHistoryService,
  SearchPersonsService,
  SearchProceedingsService,
  SearchPropertiesService,
  SearchVehiclesService,
} from './services'

@Module({
  imports: [],
  providers: [
    SearchCompaniesService,
    SearchEventsService,
    SearchFilesService,
    SearchHelperService,
    SearchHistoryService,
    SearchPersonsService,
    SearchProceedingsService,
    SearchPropertiesService,
    SearchVehiclesService,
  ],
  exports: [
    SearchCompaniesService,
    SearchEventsService,
    SearchFilesService,
    SearchHistoryService,
    SearchPersonsService,
    SearchProceedingsService,
    SearchPropertiesService,
    SearchVehiclesService,
  ],
})
export class SearchModule {}
