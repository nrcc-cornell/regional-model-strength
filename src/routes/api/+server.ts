import { json } from '@sveltejs/kit';
import data from '$lib/server/data.json';

const regionalData = data as RegionalData;

export const POST = async ({ request }) => {
	const { region, season } = await request.json() as RegionalDataRequest;
	console.log(region, season);
	if (region in regionalData) {
		return json(regionalData[region][season]);
	}
	return json({});
};