exports.successResponse = (res, message, data) => {
    return res.status(200).json({
      status: true,
      message,
      data,
    });
  };
  
 exports.notFoundResponse = (res, message, data) => {
    return res.status(404).json({
      status: false,
      message,
      data,
    });
  };

  exports.errorResponse = (res, message, data) => {
    return res.status(422).json({
      status: false,
      message,
      data,
    });
  }