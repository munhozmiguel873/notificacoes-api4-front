function NotificationCard({ canal, hora, titulo, texto, lida }) {
    return (
        <div className="bg-fundoCard border border-bordaCard rounded-xl p-4 mb-4"> {/* Card fundo */}
            <div className="flex gap-2 text-xs font-mono text-gray-700 mb-2"> {/* Hora */}
                <span className="bg-blue-100 text-marca px-2 py-0.5 rounded"> {/* Tags */}
                    {canal}
                </span>
                <span>{hora}</span>
                {!lida && <span>não lida</span>}
            </div>
            <h3 className="font-semibold text-base mb-1">{titulo}</h3>
            <p className="text-gray-800 text-sm">{texto}</p>
        </div>
    );
}

export default NotificationCard;