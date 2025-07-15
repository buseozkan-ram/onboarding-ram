import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    colour: "bg-blue-500";
}

const Button: React.FC<ButtonProps> = ({ colour, ...props }) => {
    return (
        <button
            className={`inline-block rounded-[5px] ${colour} px-5 py-3 text-sm font-medium text-white transition hover:bg-black focus:ring-3 focus:outline-hidden text-nowrap w-min cursor-pointer`}
            {...props}
        />
    );
};

export default Button;