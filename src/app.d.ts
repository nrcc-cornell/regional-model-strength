import { regions, seasons, products, rowNames, colNames } from "$lib/constants";


declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
    
    type Regions = typeof regions[number];
    type Seasons = typeof seasons[number];
    type Products = keyof typeof products;
    type Models = typeof products[Products][number]; 
    type RowNames = typeof rowNames[number];
    type ColNames = typeof colNames[number];
    type GraphData = { data: number[]; };
    type CellData = {
        strengthValue: number;
        mapPngFileName: string;
        graphData: GraphData
    };
    type SelectedCellData = CellData & { "id": string };
    type ModelData = Record<RowNames, Record<ColNames, CellData>>;
    type RegionSeasonData = Record<Products, Record<Models, ModelData>>;
    type RegionalData = Record<Regions, Record<Seasons, RegionSeasonData>>;
    type RegionalDataRequest = {
        region: Regions;
        season: Seasons;
    }
}
