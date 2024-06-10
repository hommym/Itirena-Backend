***API Documentation***
***Overview***






BaseUrl=https://itirena-backend.onrender.com/api/v1




***Routes***
***General Notes***
Data should be sent in JSON format unless otherwise specified.

All responses form server is in json format



**1.Auth Routes**

***Account Creation**
    Path= /auth/signup
    Http-Method= Post
   
    ***Body(Required)*** 
    FieldName                         Datatypes
    userName                          String
    email                             String
    password                          String

    On a successfull request
    statusCode=200
    ****Response****
    {
        "message":"Account created succesfully check email to verify account"
    }


    if request fails
    statusCode>=400
    ****Response****
    {
        "error":"Generic Error Message"
    }

***Account Login***
    Path= /auth/login
    Http-Method= Post

    ***Body(Required)*** 
    FieldName                               Datatypes
    userName/email                          String
    password                                String

    On a successfull request
    statusCode=200
    ****Response****
    {
        "message":"Login successful",
        "token":"jsonwebtoken(jwt)"
    }


     if request fails
     statusCode>=400
    ****Response****
    {
        "error":"Generic Error Message"
    }


***Account Reset***
    Path= /auth/reset-account
    Http-Method= Post

    ***Body(Required)*** 
    FieldName                               Datatypes
    email                                   String

    On a successfull request
    statusCode=200
    ****Response****
    {
        "message":"Email sent click on the link to reset password"
    }

     if request fails
     statusCode>=400
    ****Response****
    {
        "error":"Generic Error Message"
    }



***OpenAuthentication***











   





