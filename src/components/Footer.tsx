export function Footer() {
  return (
    <footer className="border-t bg-white py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()} GoatMeat Store. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <a href="#" className="hover:text-foreground hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
