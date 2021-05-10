module.exports = {
    // 选项...
    devServer:{
        port:8000,
        proxy:{
            '/api': {
                target: 'http://localhost:3000',
                changOrigin: true,
            },
        },
    }
}