import { json } from '@sveltejs/kit';
import regionalData from './data.js';

export const POST = async ({ request }) => {
	const { region, season } = await request.json() as RegionalDataRequest;
	if (region in regionalData) {
		return json(regionalData[region][season]);
	}
	return json({});
};