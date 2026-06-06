import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabaseClient";
import { mapUserFromDb, MappedUser } from "./userModel";

const COOKIE_NAME = "token";

export const getJwtToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error("JWT_SECRET_KEY is not configured");
  const expiresIn = (process.env.JWT_EXPIRE || "7d") as SignOptions["expiresIn"];
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const isProd = () => process.env.NODE_ENV === "production";

export const setAuthCookie = (res: NextResponse, token: string) => {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    ...(isProd() ? { domain: ".infosoc.in" } : {}),
  });
};

export const clearAuthCookie = (res: NextResponse) => {
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
    ...(isProd() ? { domain: ".infosoc.in" } : {}),
  });
};

const sanitizeUserForResponse = (user: MappedUser) => {
  const { password, ...rest } = user;
  return rest;
};

export const sendTokenResponse = (
  user: MappedUser,
  statusCode: number,
  message: string
): NextResponse => {
  const token = getJwtToken(user._id);
  const body = {
    success: true,
    message,
    token,
    user: sanitizeUserForResponse(user),
  };
  const res = NextResponse.json(body, { status: statusCode });
  setAuthCookie(res, token);
  return res;
};

export const verifyToken = (token: string): { id: string } | null => {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) return null;
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "object" && decoded && "id" in decoded) {
      return { id: (decoded as { id: string }).id };
    }
    return null;
  } catch {
    return null;
  }
};

const extractToken = (req: NextRequest): string | null => {
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return null;
};

export type AuthResult =
  | { ok: true; user: MappedUser }
  | { ok: false; response: NextResponse };

export const requireAuth = async (req: NextRequest): Promise<AuthResult> => {
  const token = extractToken(req);
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      ),
    };
  }

  const { data: dbUser, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", decoded.id)
    .maybeSingle();

  if (error || !dbUser) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      ),
    };
  }

  const user = mapUserFromDb(dbUser);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      ),
    };
  }

  return { ok: true, user };
};

export const requireRole = async (
  req: NextRequest,
  ...roles: string[]
): Promise<AuthResult> => {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth;

  if (!roles.includes(auth.user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          message: `User with role '${auth.user.role}' is not allowed to access this resource.`,
        },
        { status: 403 }
      ),
    };
  }

  return auth;
};

export const errorResponse = (message: string, statusCode = 500) =>
  NextResponse.json({ success: false, message }, { status: statusCode });
