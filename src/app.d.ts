import { regions, seasons, products, rowNames, colNames, tableThresholds } from "$lib/constants";


declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
    
    type RegionsObj = typeof regions;
    type Regions = typeof regions[number]['name'];
    type Seasons = typeof seasons[number];
    type ProductsObj = typeof products;
    type Products = keyof typeof products;
    type TableThresholdsObj = typeof tableThresholds;
    type Models = typeof products[Products][number];
    type DataTypes = keyof typeof rowNames;
    type RowNamesObj = typeof rowNames;
    type RowNames = typeof rowNames[DataTypes][number];
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
    };
}
