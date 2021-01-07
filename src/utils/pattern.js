/* eslint-disable */
export default {
    // email
    emailReg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    
    // name 数字 字母
    name3Reg: /^[A-Za-z0-9]+$/g,

    // name 数字 字母 下划线
    nameReg: /^[A-Za-z0-9_]{1,25}$/,

    // name2 数字 字母 下划线 中文
    name2Reg: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,

     //数字(小数或整数) 字母 下划线 中文
    name4Reg: /^-?[0-9]*(\.\d*)?$|^-?d^(\.\d*)?$|^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,

    // 密码 8 - 20 需同时包含数字、字母及特殊符号（!@#$%^&*()_等非空格
    passwordReg: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]])[A-Za-z\d~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]]{8,20}$/,

    // 唯一标识 字母开头 字母开头，仅支持字母、数字和（.）字符
    signReg: /^[a-zA-Z][\da-zA-Z_]*$/,

    // 仅输入数组
    onlyNumberReg: /^\d+$|^\d+[.]?\d+$/,

    //图片校验
    imgReg: /(.png|.jpg|.gif|.bmp|.psd|.tiff|.tga|.eps)$/i,

    //短信验证码
    verifyCode: /^\d{6}$/ig,

    //手机号码
    mobileVerify: /^1[3|4|5|6|7|8|9]\d{9}$/ig,
    
    //网址校验 包含http ftp https
    websiteReg: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
}
