
var myFn = {
    ajax: function (type, data, url, sucFn) {
        sucFn = sucFn || function () {};
        $.ajax({
            url: '/public' + url,
            type: type,
            data: data,
            cache: true,
            timeout: 30000,
            dataType: 'json',
            success: function (res, textStatus, XMLHttpRequest) {
                window.myFn.statusCode(res, sucFn);
            },
            error: function () {
                alert('网络错误');
            }
        });
    },
    // 服务器返回状态
    statusCode: function (res, sucFn) {
        switch (parseInt(res.code)) {
            case 200:
                sucFn(res);
                break;
            case 99999:
                window.vm.$router.push({name: 'login'});
                break;
            /* case 99989:
                console.log(res.msg)
                break; */
            default:
                alert(res.msg);
                break;
        }
    },
    getTime: function (obj) {
        return obj.toLocaleDateString().replace(/\//g, '-');
    },
    uploadImg: function (form, url, sucFn) {
        $.ajax({
            url: '/public' + url,
            type: 'post',
            data: form,
            processData: false,
            contentType: false,
            success: function (res) {
                window.myFn.statusCode(res, sucFn);
            }
        });
    }
}
export { myFn }
