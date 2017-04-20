/**
 * Created by Administrator on 2017/4/20.
 */
import moduleName from '../moduleName';

export default {
    [`${moduleName}/GET_ERP_LIST`]: ({ commit, dispatch, state }, { type }) => {
        const list = [
            { name: '0001,', age: 11},
            { name: '0002,', age: 22}
        ];
        commit('UPDATE_LIST', { list });
    }
}