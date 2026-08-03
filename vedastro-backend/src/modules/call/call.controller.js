import CallService from "./call.service.js";

class CallController {
  async history(req, res, next) {
    try {
      const calls = await CallService.history(req.user.id);

      res.json({
        success: true,
        data: calls,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CallController();