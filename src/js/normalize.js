export function normalizeClients(data) {
    return data.map(character => ({
        name: character.name,
        img:  character.image,
        type: 'client',
    }));
}

export function normalizeProducts(data) {
    return data.map(product => ({
        name: product.title,
        img:  product.image,
        type: 'product',
    }));
}

export function normalizeFeedback(data) {
    return data.data.map(item => ({
        name:  item.author,
        img:   null,
        text:  item.content,
        title: item.title,
        type:  'feedback',
    }));
}