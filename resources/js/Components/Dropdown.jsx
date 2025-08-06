import { useState, createContext, useContext, Fragment } from "react";
import { Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children, className = "" }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen} className={`cursor-pointer ${className}`}>
                {children}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white shadow-lg rounded-md",
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignmentClasses = {
        left: "origin-top-left left-0",
        right: "origin-top-right right-0",
        top: "origin-top",
    }[align];

    const widthClasses =
        {
            48: "w-48",
            56: "w-56",
            64: "w-64",
        }[width] || "w-48";

    return (
        <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <div
                className={`absolute z-50 mt-2 ${alignmentClasses} ${widthClasses}`}
                onClick={() => setOpen(false)}
            >
                <div
                    className={`rounded-md ring-1 ring-gray-200 ${contentClasses}`}
                >
                    {children}
                </div>
            </div>
        </Transition>
    );
};

const DropdownLink = ({
    className = "",
    children,
    active = false,
    ...props
}) => {
    return (
        <Link
            {...props}
            className={`
                block w-full px-4 py-2 text-left text-sm leading-5 
                ${
                    active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                }
                focus:outline-none focus:bg-gray-50 transition 
                duration-150 ease-in-out ${className}
            `}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
