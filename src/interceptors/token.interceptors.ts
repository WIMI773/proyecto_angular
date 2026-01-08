import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

// Interceptor de token para Angular standalone
export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token'); // Obtenemos el token del localStorage

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
