import httpRequest from './http';
import { mock, api } from './config';

class Typhoon extends httpRequest {
    /**
     * 获取台风列表
     */
    queryTyphoonList(year) {
        return this.request(`${api}/TyphoonList/${year}`)
            .then(res => {
                return Promise.resolve(res)
            })
            .catch((err) => {
                return Promise.reject(err)
            });
    }
    /**
     * 获取台风详情
     */
    queryTyphoonInfo(id) {
        return this.request(`${api}/TyphoonInfo/${id}`)
        .then(res => {
            return Promise.resolve(res)
        })
        .catch((err) => {
            return Promise.reject(err)
        });
    }

    /**
     * test
     */
    queryTest(data) {
        return this.request(`${mock}/setting/role/list`, data)
        .then(res => {
            return Promise.resolve(res)
        })
        .catch((err) => {
            return Promise.reject(err)
        });
    }
}

export default new Typhoon();
