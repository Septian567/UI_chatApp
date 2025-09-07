export default function Clock()
{
    const now = new Date().toLocaleTimeString();

    return (
        <div>
            <h1>Jam Sekarang (render statis):</h1>
            <p>{ now }</p>
        </div>
    );
}