import {inject, injectable} from "tsyringe";

import {AdminEntity} from "@entities/Admin/AdminEntity";
import {FileEntity} from "@entities/File/FileEntity";
import {ReferenceGuideEntity} from "@entities/ReferenceGuide/ReferenceGuideEntity";

import {BUCKETS, FCH_BUCKET_FOLDERS} from "@constants/CloudStorageConstant";
import {FILE_STATUSES} from "@constants/FileConstant";

import HttpResponse from "@appUtils/HttpResponse";
import SharedUtils from "@appUtils/SharedUtils";

import {BaseService} from "@application/BaseService";

import {FileFilter} from "@repositories/Shared/ORM/FileFilter";

import PaginationData from "@infraUtils/PaginationData";
import PaginationOptions from "@infraUtils/PaginationOptions";

import {cloudStorageUtils} from "@infrastructure/DIContainer/Resolver";

import {ErrorLog} from "@logger/ErrorLog";

import type {AddFileDto} from "./Dtos/AddFileDto";
import type {DownloadFileDto} from "./Dtos/DownloadFileDto";
import type {GetFileDto} from "./Dtos/GetFileDto";
import type {UpdateFileDto} from "./Dtos/UpdateFileDto";
import type {IFileRepository} from "@entities/File/IFileRepository";
import type {File} from "@infrastructure/Database/Models/File";
import type {PaginationDto} from "@infraUtils/PaginationDto";

@injectable()
export class FileService extends BaseService<File, FileEntity> {
    constructor(@inject("IFileRepository") private fileRepository: IFileRepository) {
        super(fileRepository);
    }

    async fetchBySearchQuery(searchFilters: GetFileDto) {
        return await this.fileRepository.fetchBySearchQuery(searchFilters);
    }

    async fetchPaginatedBySearchQuery(searchFilters: GetFileDto, pagination: PaginationOptions) {
        return await this.fileRepository.fetchPaginatedBySearchQuery(searchFilters, pagination);
    }

    async addFile(addFileDto: AddFileDto) {
        try {
            const fileEntity = FileEntity.create(addFileDto);
            fileEntity.fileId = SharedUtils.shortUuid();
            fileEntity.status = FILE_STATUSES.RECEIVED;
            fileEntity.isEf = false;

            await this.create({...fileEntity});

            const filePath = fileEntity.facilityId
                ? `${FCH_BUCKET_FOLDERS.FACILITIES}/${fileEntity.facilityId}/${fileEntity.repository}/${fileEntity.fileId}.${fileEntity.fileExtension}`
                : `${fileEntity.repository}/${fileEntity.fileId}.${fileEntity.fileExtension}`;

            await cloudStorageUtils.uploadFile(
                BUCKETS.FCH,
                SharedUtils.base64Decoder(addFileDto.fileContent),
                filePath
            );

            return HttpResponse.created(fileEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async getFiles(getFileDto: GetFileDto, paginationDto: PaginationDto) {
        try {
            const pagination = PaginationOptions.create(paginationDto);
            const files = await this.fetchPaginatedBySearchQuery(getFileDto, pagination);
            if (!files) {
                return HttpResponse.notFound();
            }

            const fileEntities = files.rows.map((file) => ({
                ...FileEntity.publicFields(file),
                admin: file.admin ? AdminEntity.publicFields(file.admin) : null,
                facilityName: file.facility ? file.facility.facilityName : "",
                referenceGuide: file.referenceGuide ? ReferenceGuideEntity.create(file.referenceGuide) : null
            }));

            return HttpResponse.ok(PaginationData.getPaginatedData(pagination, files.count, fileEntities));
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async updateFile(updateFileDto: UpdateFileDto) {
        try {
            const file = await this.fetch({fileId: updateFileDto.fileId});
            if (!file) {
                return HttpResponse.notFound();
            }

            const fileEntity = FileEntity.create({...file, ...updateFileDto});
            await this.update({fileId: updateFileDto.fileId}, fileEntity);

            return HttpResponse.ok(fileEntity);
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }

    async downloadFile(downloadFileDto: DownloadFileDto) {
        try {
            const searchFilters = FileFilter.setFilter(downloadFileDto);
            const file = await this.fetch(searchFilters);
            if (!file) {
                return HttpResponse.notFound();
            }

            const filePath = file.facilityId
                ? `${FCH_BUCKET_FOLDERS.FACILITIES}/${file.facilityId}/${file.repository}/${file.fileId}${downloadFileDto.isEf ? "-ef" : ""}.${file.fileExtension}`
                : `${file.repository}/${file.fileId}${downloadFileDto.isEf ? "-ef" : ""}.${file.fileExtension}`;

            const fileContent = await cloudStorageUtils.getFileContent(BUCKETS.FCH, filePath);

            return HttpResponse.ok({
                fileContent: fileContent,
                fileName: `${file.fileName}${downloadFileDto.isEf ? "-Error File" : ""}`
            });
        } catch (error) {
            return HttpResponse.error({message: ErrorLog(error)});
        }
    }
}
