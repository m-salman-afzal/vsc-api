import {In} from "typeorm";

import type {ISafeEventLocationEntity} from "@entities/SafeEventLocation/SafeEventLocationEntity";
import type {SafeEventLocation} from "@infrastructure/Database/Models/SafeEventLocation";
import type {TWhereFilter} from "@typings/ORM";

export type TFilterSafeEventLocation = Omit<Partial<ISafeEventLocationEntity>, "location"> & {
    deletedAt?: string | null;
    location: string | string[];
};
type TWhereSafeEventLocation = TWhereFilter<SafeEventLocation>;

export class SafeEventLocationFilter {
    private where: TWhereSafeEventLocation;
    constructor(filters: TFilterSafeEventLocation) {
        this.where = {};

        this.safeEventLocationId(filters);
        this.safeEventLocationId(filters);
        this.location(filters);
    }

    static setFilter(filters: TFilterSafeEventLocation) {
        return new SafeEventLocationFilter(filters).where;
    }

    safeEventLocationId(filters: TFilterSafeEventLocation) {
        if (filters.safeEventLocationId) {
            this.where.safeEventLocationId = filters.safeEventLocationId;
        }
    }

    location(filters: TFilterSafeEventLocation) {
        if (Array.isArray(filters.location)) {
            this.where.location = In(filters.location);

            return;
        }
        if (filters.location) {
            this.where.location = filters.location;
        }
    }
}
