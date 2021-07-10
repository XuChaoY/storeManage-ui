import axios from 'axios';

const service = axios.create({
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    timeout:5000
})

service.interceptors.request.use((config)=>{
    return config;
}, (error)=>{
    errorHandle(error)
    return Promise.reject(error)
})

service.interceptors.response.use((res)=>{
    if(res.status === 200){
        return Promise.resolve(res.data)
    }else{
        return Promise.reject(res);
    }
}, (error)=>{
    errorHandle(error)
    return Promise.reject(error)
})

function errorHandle(error){
    console.log(error)
}

function get(url, config){
    return service.get(url, config);
};

function post(url, param){
    return service.post(url, param)
}


export default{
    get,
    post
}