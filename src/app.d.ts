import { regions, seasons, products, models, dataTypes, rows, cols, tableThresholds } from "$lib/constants";


declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
    
    type NamesObj = {
        name: string;
        dataKey: string;
    }
    type Regions = typeof regions;
    type RegionObjs = typeof regions[number];
    type RegionNames = typeof regions[number]['name'];
    type RegionIds = typeof regions[number]['dataKey'];
    type SeasonObjs = typeof seasons[number];
    type SeasonNames = typeof seasons[number]['name'];
    type SeasonIds = typeof seasons[number]['dataKey'];
    type ProductArr = typeof products;
    type ProductObjs = typeof products[number];
    type ProductNames = typeof products[number]['name'];
    type ProductIds = typeof products[number]['dataKey'];
    type Models = typeof models[ProductIds];
    type ModelObjs = typeof models[ProductIds][number];
    type ModelNames = typeof models[ProductIds][number]['name'];
    type ModelIds = typeof models[ProductIds][number]['dataKey'];
    type SelectedModels = Record<ProductIds, ModelIds>;
    type DataTypeObjs = typeof dataTypes[number];
    type DataTypeNames = typeof dataTypes[number]['name'];
    type DataTypeIds = typeof dataTypes[number]['dataKey'];
    type RowArr = typeof rows[DataTypeIds];
    type RowObjs = typeof rows[DataTypeIds][number];
    type RowNames = typeof rows[DataTypeIds][number]['name'];
    type RowIds = typeof rows[DataTypeIds][number]['dataKey'];
    type ColArr = typeof cols;
    type ColObjs = typeof cols[number];
    type ColNames = typeof cols[number]['name'];
    type ColIds = typeof cols[number]['dataKey'];
    type TableThresholdsObj = typeof tableThresholds;
    
    type ModelData = Record<RowIds, Record<ColIds, number>>;
    type SeasonData = Record<ProductIds, Record<ModelIds, ModelData>>;
    type RegionData = Record<SeasonIds, SeasonData>;
    type RegionalDataRequest = {
        region: RegionIds;
    };

    type MapSrc = { src: string, cbar: string, title: string };
    type SelectedCellData = {
        product: ProductObjs;
        row: RowObjs;
        col: ColObjs;
    };
}
