import express, {
  json,
  Request,
  Response,
  urlencoded,
  NextFunction
} from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./db";
import routes from "./routes";
import { config, localhosts } from "./config";
import { ApiErrors } from "./controllers/utils/errorHandlers/httpErrors";
import ServiceError from "./services/utils/serviceErrors";
import { formattedNowDate } from "./controllers/utils/format";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// ______________________________________________
//                   ____
//                _.' :  `._
//          .-.'`.  ;   .'`.-.
//  __      / : ___\ ;  /___ ; \      __
// ,'_ ""--.:__;".-.";: :".-.":__;.--"" _`,
// :' `.t""--.. '<@.`;_  ',@>` ..--""j.' `;
//       `:-.._J '-.-'L__ `-- ' L_..-;'
//         "-.__ ;  .-"  "-.  : __.-"
//             L ' /.------.\ ' J
//             "-.   "--"   .-"
//             __.l"-:_JL_;-";.__
//         .-j/'.;  ;""""  / .'\"-.
//       .' /:`. "-.:     .-" .';  `.
//     .-"  / ;  "-. "-..-" .-"  :    "-.
// .+"-.  : :      "-.__.-"      ;-._   \
// ; \  `.; ;                    : : "+. ;
// :  ;   ; ;                    : ;  : \:
// ;  :   ; :                    ;:   ;  :
// : \  ;  :  ;                  : ;  /  ::
// ;  ; :   ; :                  ;   :   ;:
// :  :  ;  :  ;                : :  ;  : ;
// ;\    :   ; :                ; ;     ; ;
// : `."-;   :  ;              :  ;    /  ;
// ;    -:   ; :              ;  : .-"   :
// :\     \  :  ;            : \.-"      :
//   ;`.    \  ; :            ;.'_..--  / ;
//   :  "-.  "-:  ;          :/."      .'  :
//   \         \ :          ;/  __        :
//     \       .-`.\        /t-""  ":-+.   :
//     `.  .-"    `l    __/ /`. :  ; ; \  ;
//       \   .-" .-"-.-"  .' .'j \  /   ;/
//         \ / .-"   /.     .'.' ;_:'    ;
//         :-""-.`./-.'     /    `.___.'
//               \ `t  ._  /  ...
//                 "-.t-._:'
//
// _____________"Feel the force!"_____________

// Create te express application.
const app = express();

// Middlewares.

const baseOrigins = [config.PLATAFORMA_EDUCATIVA_CLIENT_HOST];

const allowedOrigins =
  config.NODE_ENV === "local" || config.NODE_ENV === "dev"
    ? [...baseOrigins, ...localhosts]
    : baseOrigins;

app.use(
  cors({
    origin: allowedOrigins, //temporary until cohort is made in backoffice
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true
  })
);

app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Routes.
app.use("/v1", routes);

// Custom error middleware
app.use(
  (
    error: Error | ServiceError | ApiErrors,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const status =
      error.constructor === Error
        ? 500
        : (error as ServiceError | ApiErrors).status || 500;

    const errorInfo = {
      status,
      error: error.name,
      message: error.message
    };

    console.log(`[ERROR - ${formattedNowDate()}]`, errorInfo);
    console.error(error.stack);

    res.status(status).json(errorInfo);
  }
);

const port = config.PORT || 4001;

db.sync({ force: false })
  .then(({ config }) => {
    app.listen(port, () =>
      console.log(
        `listenning on port "${port}" and connected with database "${config.database}"`
      )
    );
  })
  .catch((err) => {
    console.log(
      `No se pudo sincronizar la base de datos, el error fue: ${err}`
    );
  });

export default app;
