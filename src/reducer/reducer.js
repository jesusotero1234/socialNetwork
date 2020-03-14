export default function(state = {}, action) {
    console.log("state and action from reducer: ", state, action);

    switch (action.type) {
        case "REQUEST_STATE":
            state = {
                ...state,
                users: action.payload
            };
            break;
        case "CONFIRM_FRIENDSHIP":
            state = {
                ...state,
                users: state.users.map(el => {
                    if ((el.id == action.receiverId)) {
                        return {
                            ...el,
                            accepted:true
                        };
                    } else {
                        return el;
                    }
                })
            };
            break;
            case "REMOVE_FRIENDSHIP":
                state = {
                    ...state,
                    users: state.users.filter(el=> el.id != action.receiverId)
                };
                break;
        default:
            state = {};
    }

    return state;
}
