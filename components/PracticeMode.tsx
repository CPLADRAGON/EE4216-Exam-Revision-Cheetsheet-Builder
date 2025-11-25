import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { ViewState, Question } from '../types';
import { generateQuestions } from '../services/geminiService';

interface PracticeModeProps {
  changeView: (view: ViewState) => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ changeView }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<number[]>([]);

  const loadQuestions = async () => {
    setLoading(true);
    setRevealed([]);
    const newQuestions = await generateQuestions();
    setQuestions(newQuestions);
    setLoading(false);
  };

  const toggleAnswer = (id: number) => {
    if (revealed.includes(id)) {
      setRevealed(revealed.filter(qId => qId !== id));
    } else {
      setRevealed([...revealed, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => changeView(ViewState.DASHBOARD)}
            className="flex items-center text-slate-600 hover:text-nus-blue font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
          </button>
          <h1 className="font-bold text-lg text-slate-800">Exam Simulator</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            These questions are AI-generated based on the EE4216 exam pattern:
            <strong> Spot Errors</strong>, <strong>Fill Blanks</strong>, and <strong>Concepts</strong>.
          </p>
        </div>

        {questions.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-slate-400 mb-4">No questions loaded yet.</div>
            <button
              onClick={loadQuestions}
              className="bg-nus-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" /> Generate Practice Set
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nus-blue mx-auto mb-4"></div>
            <p className="text-slate-500">Consulting the digital TA...</p>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Question {index + 1} • {q.type.replace('_', ' ')}
                </span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-6">
                <p className="text-lg font-medium text-slate-800 mb-4">{q.question}</p>

                {q.codeContext && (
                  <div className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{q.codeContext}</pre>
                  </div>
                )}

                <div className="mt-6">
                  {!revealed.includes(q.id) ? (
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-nus-blue hover:bg-blue-50 px-4 py-2 rounded-lg border border-nus-blue transition-colors text-sm font-medium"
                    >
                      Reveal Answer
                    </button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-green-800">Answer: </span>
                          <span className="text-green-900">{q.answer}</span>
                        </div>
                      </div>
                      <div className="ml-8 text-sm text-green-700">
                        <strong>Explanation: </strong>{q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadQuestions}
              className="text-slate-600 hover:text-nus-blue font-medium flex items-center justify-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Generate New Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeMode;