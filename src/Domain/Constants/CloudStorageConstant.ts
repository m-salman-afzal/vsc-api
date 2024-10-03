import {google} from "@infraConfig/index";

export const BUCKETS = {
    SAPPHIRE: google.SAPPHIRE_BUCKET,
    FCH: google.FCH_BUCKET
};

export const SAPPHIRE_BUCKET_FOLDERS = {PROCESSED: "Processed"};

export const FCH_BUCKET_FOLDERS = {
    FACILITIES: "FACILITIES",
    SAPPHIRE: "SAPPHIRE",
    SFTP: "SFTP"
};
