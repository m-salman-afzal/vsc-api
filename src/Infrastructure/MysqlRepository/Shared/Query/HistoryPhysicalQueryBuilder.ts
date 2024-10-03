import type {IHistoryPhysicalEntity} from "@entities/HistoryPhysical/HistoryPhysicalEntity";
import type {IPatientEntity} from "@entities/Patient/PatientEntity";
import type {HistoryPhysical} from "@infrastructure/Database/Models/HistoryPhysical";
import type {TQueryBuilder} from "@src/typings/ORM";

type TFilterHistoryPhysical = Partial<IHistoryPhysicalEntity> &
    Partial<IPatientEntity> & {
        toDate?: string;
        fromDate?: string;
    };

type TQueryBuilderHistoryPhysical = TQueryBuilder<HistoryPhysical>;

export class HistoryPhysicalQueryBuilder {
    private query: TQueryBuilderHistoryPhysical;
    constructor(query: TQueryBuilderHistoryPhysical, filters: TFilterHistoryPhysical) {
        this.query = query;

        this.setHistoryPhysicalId(filters);
        this.setFacilityId(filters);
        this.setAnnualDate(filters);
        this.setInitialDate(filters);
        this.setIsYearly(filters);
        this.setIsActive(filters);
    }

    static setFilter(query: TQueryBuilderHistoryPhysical, filters) {
        return new HistoryPhysicalQueryBuilder(query, filters).query;
    }

    setHistoryPhysicalId(filters: TFilterHistoryPhysical) {
        if (filters.historyPhysicalId) {
            this.query.andWhere("historyPhysical.historyPhysicalId = :historyPhysicalId", {
                historyPhysicalId: filters.historyPhysicalId
            });
        }
    }

    setFacilityId(filters: TFilterHistoryPhysical) {
        if (filters.facilityId) {
            this.query.andWhere("historyPhysical.facilityId = :facilityId", {
                facilityId: filters.facilityId
            });
        }
    }

    setAnnualDate(filters: TFilterHistoryPhysical) {
        if (filters.annualDate) {
            this.query.andWhere("historyPhysical.annualDate <= :annualDate", {
                annualDate: filters.annualDate
            });

            return;
        }

        if (filters.toDate && filters.fromDate) {
            this.query.andWhere("historyPhysical.annualDate BETWEEN :fromDate AND :toDate", {
                toDate: filters.toDate,
                fromDate: filters.fromDate
            });
        }
    }

    setInitialDate(filters: TFilterHistoryPhysical) {
        if (filters.initialDate) {
            this.query.andWhere("historyPhysical.initialDate <= :initialDate", {
                initialDate: filters.initialDate
            });
        }
    }

    setIsYearly(filters: TFilterHistoryPhysical) {
        if (filters.isYearly) {
            this.query.andWhere("historyPhysical.isYearly = :isYearly", {
                isYearly: filters.isYearly
            });
        }
    }

    setIsActive(filters: TFilterHistoryPhysical) {
        if (filters.status) {
            this.query.andWhere("patient.status = :status", {
                status: filters.status
            });
        }
    }
}
