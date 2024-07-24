import Header from './user/landing/Header';
import './index.css';

const App = () => {
  return (
    <div>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <section id="home" className="text-center p-8">
          <h1 className="text-5xl font-bold text-gray-900">Welcome to LearnLink</h1>
          <p className="mt-4 text-gray-700">Your go-to platform for professional social networking and learning.</p>
          <div className="mt-8">
            <a href="#get-started" className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700">Get Started</a>
          </div>
        </section>
        <section id="courses" className="p-8 bg-white w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900">Courses</h2>
          <p className="mt-4 text-gray-700">Learn about our available courses.</p>
        </section>
        <section id="book-store" className="p-8 bg-gray-100 w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900">Book Store</h2>
          <p className="mt-4 text-gray-700">Explore our collection of books.</p>
        </section>
        <section id="chats" className="p-8 bg-white w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900">Chats</h2>
          <p className="mt-4 text-gray-700">Join our chat rooms and connect with others.</p>
        </section>
        <section id="about-us" className="p-8 bg-gray-100 w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
          <p className="mt-4 text-gray-700">Learn more about our mission and team.</p>
        </section>
      </main>
    </div>
  );
}

export default App