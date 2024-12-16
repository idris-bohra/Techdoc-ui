import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.url;
    const modifiedRequest = request.clone();
    modifiedRequest.headers.set('x-full-url', url);
    return NextResponse.next(modifiedRequest);
}