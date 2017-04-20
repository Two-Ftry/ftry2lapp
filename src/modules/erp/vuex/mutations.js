/**
 * Created by Administrator on 2017/4/20.
 */
import moduleName from '../moduleName';

export default {
    [`${moduleName}/UPDATE_LIST`]: (state, { list }) => {
        state.list = state.list.concat(list);
    }
}