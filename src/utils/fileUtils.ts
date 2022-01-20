import path from 'path';
import fs from 'fs';

export const ROOT_STATIC_PATH = path.join(process.cwd(), 'public');
export const HOME_BANNER_PATH = path.join(ROOT_STATIC_PATH, 'images', 'home-banners');

export const getAllBannerNames = () => fs.readdirSync(HOME_BANNER_PATH);
