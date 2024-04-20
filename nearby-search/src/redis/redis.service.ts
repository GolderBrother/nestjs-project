import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
	@Inject('REDIS_CLIENT')
	private redisClient: RedisClientType;
	/**
	 * 传入 key 和位置信息，底层调用 redis 的 geoadd 来添加数据。
	 * @param key 
	 * @param posName 
	 * @param posLoc 
	 * @returns 
	 */
	async geoAdd(key: string, posName: string, posLoc: [number, number]) {
		return await this.redisClient.geoAdd(key, {
			longitude: posLoc[0],
			latitude: posLoc[1],
			member: posName
		})
	}

	/**
	 * 查询位置信息
	 * @param key 
	 * @param posName 
	 */
	async geoPos(key: string, posName: string) {
		const res = await this.redisClient.geoPos(key, posName);
		const { longitude, latitude } = res[0];
		return {
			name: posName,
			longitude,
			latitude
		}
	}

	/**
	 * 查询位置列表
	 * @param key 
	 * @returns 
	 */
	async getList(key: string) {
		// zset 是有序列表，列表项会有一个分数，zrange 是返回某个分数段的 key，传入 0、-1 就是返回所有的。
		const positions = await this.redisClient.zRange(key, 0, -1);
		const list = [];
		for (const pos of positions) {
			// 用 geoPos 拿到它对应的位置信息。
			const res = await this.geoPos(key, pos);
			list.push(res);
		}
		return list;
	}

	/**
	 * 传入 key，经纬度、搜索半径，返回附近的点
	 * @param key 
	 * @param pos 经纬度
	 * @param radius 搜索半径
	 * @returns 
	 */
	async geoSearch(key: string, pos: [number, number], radius: number) {
		const [longitude, latitude] = pos || [];
		// 用 geoRadius 搜索半径内的点，然后再用 geoPos 拿到点的经纬度返回
		const positions = await this.redisClient.geoRadius(key, {
			longitude,
			latitude
		}, radius, 'km');
		const list = [];
		for (const pos of positions) {
			const res = await this.geoPos(key, pos);
			list.push(res);
		}
		return list;
	}
}
