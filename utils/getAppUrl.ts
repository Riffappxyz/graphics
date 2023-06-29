const getAppUrl = () => {
    const vercel = process.env.VERCEL_URL
    const appUrl = vercel ?`https://${vercel}` : 'http://localhost:4000';
    return appUrl
}

export default getAppUrl