import React, { useState, useMemo } from 'react';
import { ChevronDown, Send, UtensilsCrossed } from 'lucide-react';

interface Kit {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Option {
  id: number;
  name: string;
  quantity: number;
}

const kits: Kit[] = [
  { id: 1, name: 'Kit com 5 marmitas', quantity: 5, price: 80 },
  { id: 2, name: 'Kit com 10 marmitas', quantity: 10, price: 140 },
];

const carboidratos: Option[] = [
  { id: 1, name: 'Arroz Branco', quantity: 0 },
  { id: 2, name: 'Purê de Batata', quantity: 0 },
  { id: 3, name: 'Macarrão', quantity: 0 },
  { id: 4, name: 'Escondidinho', quantity: 0 },
  { id: 5, name: 'Purê de Abóbora', quantity: 0 },
];

const proteinas: Option[] = [
  { id: 1, name: 'Almôndegas ao Sugo', quantity: 0 },
  { id: 2, name: 'Coxa ou Sobrecoxa Assada', quantity: 0 },
  { id: 3, name: 'Frango com Creme de Milho', quantity: 0 },
  { id: 4, name: 'Peito de Frango Grelhado', quantity: 0 },
  { id: 5, name: 'Carne ao Molho', quantity: 0 },
];

function App() {
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [selectedCarbs, setSelectedCarbs] = useState<Option[]>(carboidratos);
  const [selectedProteins, setSelectedProteins] = useState<Option[]>(proteinas);

  const totalQuantity = useMemo(() => {
    const carbsTotal = selectedCarbs.reduce((acc, item) => acc + item.quantity, 0);
    const proteinsTotal = selectedProteins.reduce((acc, item) => acc + item.quantity, 0);
    return carbsTotal + proteinsTotal;
  }, [selectedCarbs, selectedProteins]);

  const isValidOrder = useMemo(() => {
    if (!selectedKit) return false;
    return totalQuantity === selectedKit.quantity * 2; // Each meal needs 1 carb + 1 protein
  }, [selectedKit, totalQuantity]);

  const handleQuantityChange = (
    type: 'carbs' | 'proteins',
    id: number,
    newQuantity: number
  ) => {
    const setter = type === 'carbs' ? setSelectedCarbs : setSelectedProteins;
    const items = type === 'carbs' ? selectedCarbs : selectedProteins;
    
    setter(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const formatWhatsAppMessage = () => {
    if (!selectedKit) return '';

    const message = `*Novo Pedido - Flor de Sal*\n\n` +
      `*Kit Selecionado:* ${selectedKit.name}\n` +
      `*Valor:* R$ ${selectedKit.price.toFixed(2)}\n\n` +
      `*Carboidratos:*\n${selectedCarbs
        .filter((carb) => carb.quantity > 0)
        .map((carb) => `- ${carb.name}: ${carb.quantity}x`)
        .join('\n')}\n\n` +
      `*Proteínas:*\n${selectedProteins
        .filter((protein) => protein.quantity > 0)
        .map((protein) => `- ${protein.name}: ${protein.quantity}x`)
        .join('\n')}`;

    return encodeURIComponent(message);
  };

  return (
    <div 
      className="min-h-screen bg-white flex flex-col"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex-grow bg-white/90 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://i.imgur.com/watUar2.png" 
                alt="Flor de Sal Logo" 
                className="h-20 w-auto max-w-full" 
               />
            </div>
            <h1 className="text-6xl text-[#2F855A] mb-4 font-light">Flor de Sal</h1>
            <p className="text-[#276749] text-xl">Gastronomia Saudável</p>
          </div>

          {/* Kit Selection */}
          <div className="bg-white border border-[#C6F6D5] rounded-lg p-8 mb-8">
            <h2 className="text-2xl mb-6 text-[#2F855A] font-light">1. Escolha seu Kit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kits.map((kit) => (
                <button
                  key={kit.id}
                  onClick={() => setSelectedKit(kit)}
                  className={`p-6 rounded-lg border transition-all ${
                    selectedKit?.id === kit.id
                      ? 'border-[#48BB78] bg-[#F0FFF4]'
                      : 'border-[#C6F6D5] hover:border-[#48BB78]'
                  }`}
                >
                  <h3 className="text-xl mb-2 text-[#2F855A]">{kit.name}</h3>
                  <p className="text-[#276749] font-medium text-lg">R$ {kit.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedKit && (
            <>
              {/* Options Selection */}
              <div className="bg-white border border-[#C6F6D5] rounded-lg p-8 mb-8">
                <h2 className="text-2xl mb-6 text-[#2F855A] font-light">2. Escolha os Sabores</h2>
                
                {/* Carboidratos */}
                <div className="mb-8">
                  <h3 className="text-xl text-[#2F855A] mb-4 font-light">Carboidratos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCarbs.map((carb) => (
                      <div
                        key={carb.id}
                        className="flex items-center justify-between p-4 border border-[#C6F6D5] rounded-lg bg-[#F0FFF4]"
                      >
                        <span className="text-[#2F855A]">{carb.name}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityChange('carbs', carb.id, carb.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#48BB78] text-[#2F855A] hover:bg-[#C6F6D5] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-[#2F855A]">{carb.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange('carbs', carb.id, carb.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#48BB78] text-[#2F855A] hover:bg-[#C6F6D5] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proteínas */}
                <div>
                  <h3 className="text-xl text-[#2F855A] mb-4 font-light">Proteínas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProteins.map((protein) => (
                      <div
                        key={protein.id}
                        className="flex items-center justify-between p-4 border border-[#C6F6D5] rounded-lg bg-[#F0FFF4]"
                      >
                        <span className="text-[#2F855A]">{protein.name}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                'proteins',
                                protein.id,
                                protein.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#48BB78] text-[#2F855A] hover:bg-[#C6F6D5] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-[#2F855A]">{protein.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                'proteins',
                                protein.id,
                                protein.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#48BB78] text-[#2F855A] hover:bg-[#C6F6D5] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-[#C6F6D5] rounded-lg p-8">
                <h2 className="text-2xl mb-6 text-[#2F855A] font-light">3. Resumo do Pedido</h2>
                <div className="mb-6">
                  <p className="text-[#2F855A] text-lg">
                    Total selecionado: {totalQuantity} de{' '}
                    {selectedKit.quantity * 2} opções necessárias
                  </p>
                  {!isValidOrder && (
                    <p className="text-[#276749] text-sm mt-2">
                      Selecione exatamente {selectedKit.quantity} carboidratos e{' '}
                      {selectedKit.quantity} proteínas
                    </p>
                  )}
                </div>
                <a
                  href={`https://wa.me/5511999999999?text=${formatWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg text-white font-medium transition-all ${
                    isValidOrder
                      ? 'bg-[#2F855A] hover:bg-[#276749]'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  onClick={(e) => !isValidOrder && e.preventDefault()}
                >
                  <Send className="w-5 h-5" />
                  Finalizar Pedido
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#2F855A] py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm">
            Desenvolvido por{' '}
            <a 
              href="https://www.laboratech.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-[#C6F6D5] transition-colors"
            >
              Labora Tech
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;