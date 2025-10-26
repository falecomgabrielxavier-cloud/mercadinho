
import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import { useCart } from './hooks/useCart';
import RecipeModal from './components/RecipeModal';
import { generateRecipeFromIngredients } from './services/geminiService';

const App: React.FC = () => {
    const { isCartOpen, toggleCart, cartItems } = useCart();
    const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
    const [recipe, setRecipe] = useState<string | null>(null);
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
    const [recipeError, setRecipeError] = useState<string | null>(null);

    const handleGenerateRecipe = async () => {
        if (cartItems.length === 0) return;
        
        setIsLoadingRecipe(true);
        setRecipe(null);
        setRecipeError(null);
        setRecipeModalOpen(true);

        const ingredientNames = cartItems.map(item => item.name.split('(')[0].trim());
        
        try {
            const generatedRecipe = await generateRecipeFromIngredients(ingredientNames);
            setRecipe(generatedRecipe);
        } catch (error) {
            console.error("Failed to generate recipe:", error);
            setRecipeError("Desculpe, não foi possível gerar a receita no momento. Por favor, tente novamente mais tarde.");
        } finally {
            setIsLoadingRecipe(false);
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-transparent text-gray-800">
            <Header />

            <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <section id="produtos" className="py-12">
                    <h2 className="text-4xl font-extrabold text-center mb-10 text-white drop-shadow-lg">Nossos Produtos</h2>
                    <ProductList />
                </section>

                <section id="sobre" className="py-16 my-8 p-8 bg-white/95 rounded-xl shadow-lg backdrop-blur-sm">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Sobre Nós</h2>
                    <p className="text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
                        Bem-vindo ao Mercadinho do Bairro! Desde 2005, oferecemos produtos frescos e de qualidade para a nossa comunidade.
                        Nosso compromisso é trazer o melhor da fazenda para a sua mesa, com um atendimento amigável e preços justos.
                        Venha nos visitar e descubra a diferença de comprar local!
                    </p>
                </section>

                <section id="contato" className="py-12">
                    <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">Contato e Localização</h2>
                    <div className="max-w-3xl mx-auto bg-white/95 rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-900 backdrop-blur-sm">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Endereço</h3>
                            <p className="text-gray-700">Rua das Flores, 123<br/>Bairro Centro<br/>Sua Cidade, UF - 12345-678</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Horário de Funcionamento</h3>
                            <p className="text-gray-700"><strong>Segunda a Sábado:</strong> 8:00 - 20:00</p>
                            <p className="text-gray-700"><strong>Domingos e Feriados:</strong> 8:00 - 14:00</p>
                            <h3 className="text-xl font-semibold mt-4 mb-2">Telefone</h3>
                            <p className="text-gray-700">(99) 91234-5678</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <CartModal isOpen={isCartOpen} onClose={toggleCart} onGenerateRecipe={handleGenerateRecipe} />
            <RecipeModal 
                isOpen={isRecipeModalOpen} 
                onClose={() => setRecipeModalOpen(false)}
                recipe={recipe}
                isLoading={isLoadingRecipe}
                error={recipeError}
            />
        </div>
    );
};

export default App;
