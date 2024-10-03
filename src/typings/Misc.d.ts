export type ReplaceKeys<Input, SearchKeys extends keyof Input, Updater> = {
    [InputKeys in keyof Input]: InputKeys extends SearchKeys
        ? InputKeys extends keyof Updater
            ? Updater[InputKeys]
            : never
        : Input[InputKeys];
};

export type DeepPartial<T> =
    | T
    | (T extends Array<infer U>
          ? DeepPartial<U>[]
          : T extends Map<infer K, infer V>
            ? Map<DeepPartial<K>, DeepPartial<V>>
            : T extends Set<infer M>
              ? Set<DeepPartial<M>>
              : T extends object
                ? {
                      [K in keyof T]?: DeepPartial<T[K]>;
                  }
                : T);

export type PickBooleansFromObject<T> = {
    [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
