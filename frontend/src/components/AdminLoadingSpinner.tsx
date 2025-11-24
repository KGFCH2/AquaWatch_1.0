import styled from "styled-components";

export const AdminLoadingSpinner = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <span>Aquawatch</span>
        <span>Aquawatch</span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader span {
    position: absolute;
    color: #fff;
    font-size: 38px;
    letter-spacing: 5px;
  }

  .loader span:nth-child(1) {
    color: transparent;
    -webkit-text-stroke: 0.3px rgb(255, 154, 88);
  }

  .loader span:nth-child(2) {
    color: rgb(255, 154, 88);
    -webkit-text-stroke: 1px rgb(255, 154, 88);
    animation: uiverse723 3s ease-in-out infinite;
  }

  @keyframes uiverse723 {
    0%,
    100% {
      clip-path: polygon(
        0% 45%,
        15% 44%,
        32% 50%,
        54% 60%,
        70% 61%,
        84% 59%,
        100% 52%,
        100% 100%,
        0% 100%
      );
    }

    50% {
      clip-path: polygon(
        0% 60%,
        16% 65%,
        34% 66%,
        51% 62%,
        67% 50%,
        84% 45%,
        100% 46%,
        100% 100%,
        0% 100%
      );
    }
  }
`;
