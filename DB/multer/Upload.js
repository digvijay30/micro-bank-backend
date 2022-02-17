import multer from "multer";
import { dirname, extname } from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dirname("") + "../../uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    return cb(
      { type: "error", message: `${file.mimetype} not Acceptable` },
      false
    );
  }
};

export default multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
