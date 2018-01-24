package com.kenny.controller;


import com.kenny.common.Constant;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;


/**
 *
 * 订单平台登录模块
 *
 * @author kewei
 *
 */
@Controller
@RequestMapping("/login/")
public class LoginMangerController {


    private static final Logger log = Logger.getLogger(LoginMangerController.class);


    /**
     * 系统登录页面
     */
    private static final String preLogin = "/pages/login/login";



    @RequestMapping("preLogin")
    public String preLogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> loginResult = new HashMap<String, Object>();
        loginResult.put(Constant.MSG.toString(), "");
        request.setAttribute("loginResult", loginResult);
        return preLogin;
    }

}
