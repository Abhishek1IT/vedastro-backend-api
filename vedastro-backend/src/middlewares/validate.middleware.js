import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    if (schema.shape && (schema.shape.body || schema.shape.params || schema.shape.query)) {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body;
      req.params = validated.params;

      if (validated.query) {
        Object.assign(req.query, validated.query);
      }
    } else {
      req.body = schema.parse(req.body);
    }
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map((issue) => {
          const path = schema.shape && (schema.shape.body || schema.shape.params)
            ? issue.path.slice(1)
            : issue.path;

          return {
            field: path.join("."),
            message: issue.message,
          };
        }),
      });
    }
    next(error);
  }
};

export default validate;
