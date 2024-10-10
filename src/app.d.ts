import { regions, seasons, products, rowNames, colNames } from "$lib/constants";


declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export type Regions = typeof regions[number];
export type Seasons = typeof seasons[number];
export type Products = keyof typeof products;
export type Models = typeof products[Products][number]; 
export type RowNames = typeof rowNames[number];
export type ColNames = typeof colNames[number];

type GraphData = { data: number[]; };
type CellData = {
    strengthValue: number;
    mapPngFileName: string;
    graphData: GraphData
};
type ModelData = Record<RowNames, Record<ColNames, CellData>>;
export type RegionSeasonData = Record<Products, Record<Models, ModelData>>;
export type RegionalData = Record<Regions, Record<Seasons, RegionSeasonData>>;
export type RegionalDataRequest = {
	region: Regions;
	season: Seasons;
}