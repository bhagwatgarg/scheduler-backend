class HTTPError extends Error{
  constructor(message, code){
    super(message);
    this.code=code;
  }
}

module.exports=HTTPError;