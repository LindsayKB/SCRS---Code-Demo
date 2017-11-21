<?php
/*
screenShot class - Capture webpage screenshots
version 1.0 12/7/2015

API reference at https://screenshotlayer.com/documentation

Copyright (c) 2015, Wagon Trader

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
class screenShot{
    
    //*********************************************************
    // Settings
    //*********************************************************
    
    //Your screenshotLayer API key
    //Available at https://screenshotlayer.com/product
    private $apiKey = 'YOUR_API_KEY_HERE';
    
    //API endpoint
    //only needs to change if the API changes location
    private $endPoint = 'http://api.screenshotlayer.com/api/capture';
    
    //Secret Keyword defined in your screenshotLayer dashboard
    //leave blank if you have not activated this feature
    private $secretKey = '';
    
    //API key/value pair params
    public $params = array();
    
    //response capture
    public $capture;
    
    //image info
    public $imageInfo;
    
    /*
    method:  class construction
    usage:   screenShot([string url]);
    params:  url = URL to web video
    
    The screenshotLayer API requires a valid webpage URL to capture.
    
    returns: null
    */
    public function __construct($url='',$format='PNG'){
        
        $this->params['url'] = $url;
        if( !empty($this->secretKey) ){
            
            $secret = md5($url.$this->secretKey);
            $this->params['secret_key'] = $secret;
            
        }
        
    }
    
    /*
    method:  displayImage
    usage:   displayImage(void);
    params:  none
    
    This method will write an image tag with the correct request url.
    Note: this method will not verify the request is to a valid url and
    will return a broken image if not.
    
    returns: null
    */
    public function displayImage(){
        
        $request = $this->buildRequest();
        
        echo '<img src="'.$request.'">';
        
    }
    
    /*
    method:  captureScreen
    usage:   captureScreen(void);
    params:  none
    
    This method will query the api for the binary code of the captured webpage.
    
    returns: null
    */
    public function capturePage(){
        
        $request = $this->buildRequest();
        
        $this->capture = file_get_contents($request);
        
        $this->imageInfo = getimagesizefromstring($this->capture);
        
        if( empty($this->imageInfo) ){
            
            if( empty($this->capture) ){
                
                throw new Exception('An unknown error has occured');
                
            }else{
                
                $response = json_decode($this->capture);
                
                throw new Exception($response->error->info);
                
            }
            
        }
        
    }
    
    /*
    method:  downloadCapture
    usage:   downloadCapture([string fileName='']);
    params:  fileName = The name of the file written to disk
    
    This method will download the captured image to the client.
    
    returns: null
    */
    public function downloadCapture($fileName=''){
        
        $fileName = ( empty($fileName) ) ? 'capture' : $fileName;
        
        if( empty($this->capture) ){
            
            throw new Exception('No image has been captured');
            
        }
        
        header('Content-Type: '.$this->imageInfo['mime']);
        header('Content-Disposition: attachment; filename="'.$fileName.'"');
        header('Content-Transfer-Encoding: binary');
        
        echo $this->capture;
        
    }
    
    /*
    method:  displayCapture
    usage:   displayCapture(void);
    params:  none
    
    This method will display the captured image to the browser.
    
    returns: null
    */
    public function displayCapture(){
        
        if( empty($this->capture) ){
            
            throw new Exception('No image has been captured');
            
        }
        
        header('Content-Type: '.$this->imageInfo['mime']);
        
        echo $this->capture;
        
    }
    
    /*
    method:  buildRequest
    usage:   buildRequest(void);
    params:  none
    
    This method will build the api request url.
    
    returns: api request url
    */
    public function buildRequest(){
        
        if( empty($this->params['url']) ){
            
            throw new Exception('API requires URL to video');
            
        }
        
        $request = $this->endPoint.'?access_key='.$this->apiKey;
        
        foreach( $this->params as $key=>$value ){
            
            if( $key == 'url' ){
                
                $request .= '&url='.urlencode($value);
                
            }else{
                
                $request .= '&'.$key.'='.$value;
                
            }
            
        }
        
        return $request;
        
    }
    
    /*
    method:  setParam
    usage:   setParam(string key, string value);
    params:  key = key of the params key/value pair
             value =  value of the params key/value pair
    
    add or change the params key/value pair specified.
    
    returns: null
    */
    public function setParam($key,$value){
        
        $this->params[$key] = $value;
        
    }
}
?>
